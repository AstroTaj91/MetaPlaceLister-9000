import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { identifyItemFromImage } from '../services/vision';
import { getMarketPricing } from '../services/pricing';
import { generateListingText } from '../services/generator';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = fileBuffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log('[1/3] Calling Vision API...');
    const visionData = await identifyItemFromImage(base64Image, mimeType);
    console.log('Vision Data:', visionData);

    let pricingData;
    try {
      console.log('[2/3] Calling Firecrawl Pricing Engine...');
      pricingData = await getMarketPricing(visionData.item_name);
      console.log('Pricing Data:', pricingData);
    } catch (pricingError) {
      console.error('Pricing lookup failed, falling back to defaults:', pricingError);
      pricingData = { suggestedPrice: 0, priceRange: { low: 0, high: 0 }, dataPoints: 0 };
    }

    console.log('[3/3] Calling Listing Generator...');
    const generated = await generateListingText(visionData, pricingData);
    console.log('Generated Listing:', generated);

    return res.json({
      success: true,
      data: {
        imageUrl,
        visionData,
        pricingData,
        listing: generated
      }
    });
  } catch (error: any) {
    console.error('Analyze Route Error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during analysis' });
  }
});

export default router;
