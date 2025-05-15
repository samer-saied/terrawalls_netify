const userData = {
  id: "Samersaied",
  updated_at: "2025-04-14T01:02:12Z",
  username: "samersaied",
  name: "TerraWalls",
  first_name: "Terra",
  last_name: "Walls",
  twitter_username: null,
  portfolio_url: "https://samer-saied.vercel.app/",
  bio: null,
  location: "Egypt",
  instagram_username: null,
  total_collections: 0,
  total_likes: 0,
  total_photos: 2,
  total_promoted_photos: 0,
  total_illustrations: 0,
  total_promoted_illustrations: 0,
  accepted_tos: true,
  for_hire: false,
  social: {
    instagram_username: null,
    portfolio_url: "https://samer-saied.vercel.app/",
    twitter_username: null,
    paypal_email: null,
  },
};

const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

const app = express();
const port = 80;
const publicDir = path.join(__dirname, "public");
// Serve static files from the 'public' directory
app.use(express.static(publicDir));

app.get("/", async (req, res) => {
  result = {
    Copyrights: "TerraWalls",
    Status: "OK",
  };
  res.json(result);
});

app.get("/images", async (req, res) => {
  try {
    const files = await fs.readdir(publicDir);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(ext);
    });

    const imagesData = await Promise.all(
      imageFiles.map(async (file, index) => {
        const filePath = path.join(publicDir, file);
        // const stats = await fs.stat(filePath);
        // const createdAt = stats.birthtime.toISOString();

        const baseName = path.basename(file, path.extname(file));
        const title = baseName
          .replace(/[-_]/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        let metadata = await sharp(filePath).metadata();

        return {
          id: index + 1,
          urls: {
            raw: `${req.protocol}://${req.headers.host}/${file}`,
            full: `${req.protocol}://${req.headers.host}/${file}`,
            regular: `${req.protocol}://${req.headers.host}/${file}`,
            small: `${req.protocol}://${req.headers.host}/${file}`,
            thumb: `${req.protocol}://${req.headers.host}/${file}`,
          },
          link: `/${file}`,
          title: title,
          slug: baseName,
          description: title,
          alt_description: title,
          created_at: null, // Use the actual creation time
          width: metadata.width,
          height: metadata.height,
          user: userData,
          asset_type: "photo",
        };
      })
    );
    const shuffledImages = imagesData.sort(() => Math.random() - 0.5);

    res.json({ images: shuffledImages });
  } catch (error) {
    console.error("Error reading public directory:", error);
    res.status(500).json({ error: "Failed to retrieve image list" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
