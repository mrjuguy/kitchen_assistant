import renderer from "react-test-renderer";

import { MonoText } from "../StyledText";

jest.mock("../Themed", () => ({
  Text: (props) => {
    const { Text } = require("react-native");
    return <Text {...props} />;
  },
}));

it(`renders correctly`, () => {
  const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});
