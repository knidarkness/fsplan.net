import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 15, maxKeys: 50000 });

export default cache;
