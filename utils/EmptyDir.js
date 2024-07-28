import { promises as fs } from "fs";
import path from "path";

const removeAllFiles = async (dir) => {
  const files = await fs.readdir(dir);

  for (const item of files) {
    const filePath = path.join(dir, item);
    await fs.unlink(filePath);
  }
};

export default removeAllFiles;
