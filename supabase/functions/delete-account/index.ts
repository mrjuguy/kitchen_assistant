import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization")!;
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const userId = user.id;

    // 1. Identify households where this user is the only member
    const { data: memberOfHouseholds, error: membershipError } =
      await supabaseClient
        .from("household_members")
        .select("household_id")
        .eq("user_id", userId);

    if (membershipError) throw membershipError;

    for (const { household_id } of memberOfHouseholds || []) {
      const { count, error: countError } = await supabaseClient
        .from("household_members")
        .select("*", { count: "exact", head: true })
        .eq("household_id", household_id);

      if (countError) throw countError;

      if (count === 1) {
        // Last member, delete the household (cascades to pantry, meal plans, etc.)
        const { error: deleteHouseholdError } = await supabaseClient
          .from("households")
          .delete()
          .eq("id", household_id);

        if (deleteHouseholdError) throw deleteHouseholdError;
      }
    }

    // 2. Delete the user from auth.users (cascades to profiles and household_members)
    const { error: deleteUserError } =
      await supabaseClient.auth.admin.deleteUser(userId);

    if (deleteUserError) throw deleteUserError;

    return new Response(
      JSON.stringify({ message: "Account deleted successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
