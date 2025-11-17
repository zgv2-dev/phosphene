import envPaths from "env-paths";

const xdgPaths = envPaths("phosphene", { suffix: "" });

export default xdgPaths;
