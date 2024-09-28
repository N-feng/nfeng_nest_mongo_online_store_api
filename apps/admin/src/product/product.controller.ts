import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
import { ExceptionsLoggerFilter } from '../exceptions-logger/exceptions-logger.filter';
import { ToolsService } from '@app/tools';

// const storageProduct = diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/products');
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.split('.')[0];
//     const extension = extname(file.originalname);
//     const randomName = Array(32)
//       .fill(null)
//       .map(() => Math.round(Math.random() * 16).toString(16))
//       .join('');
//     cb(null, `${name}-${randomName}${extension}`);
//   },
// });

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '产品列表' })
  async findAll() {
    const result = await this.productService.findAll();
    return {
      success: true,
      message: 'Product retrieved successfully.',
      data: result,
    };
  }

  @Get('findOne')
  @ApiOperation({ summary: '查询产品' })
  async findOne(@Query('id') id: string) {
    const user = await this.productService.findOne(id);
    return { code: 200, data: user };
  }

  // create new product
  @Post('/')
  @ApiOperation({ summary: '创建产品' })
  @UseFilters(new ExceptionsLoggerFilter())
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 },
      ],
      {
        // storage: storageProduct,
        limits: {
          fileSize: 1024 * 1024 * 5, // limit filesize to 5MB
        },
      },
    ),
  )
  async create(
    @Body() body,
    @Res() res: Response,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    // Extract product data from the request body
    const {
      name,
      description,
      quantity,
      price,
      offerPrice,
      proCategoryId,
      proSubCategoryId,
      proBrandId,
      proVariantTypeId,
      proVariantId,
    } = body;

    // Check if any required fields are missing
    if (
      !name ||
      !quantity ||
      !price ||
      !proCategoryId ||
      !proSubCategoryId ||
      !proVariantTypeId
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Required fields are missing.' });
    }

    // Initialize an array to store image URLs
    const imageUrls = [];

    // Iterate over the file fields
    const fields = ['image1', 'image2', 'image3', 'image4', 'image5'];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (files[field] && files[field].length > 0) {
        const file = files[field][0];
        const imageUrl = await this.toolsService.uploadFile(file, 'product');
        imageUrls.push({ image: i + 1, url: imageUrl });
      }
    }

    console.log('imageUrls: ', imageUrls);
    // Create a new product object with data
    await this.productService.create({
      name,
      description,
      quantity,
      price,
      offerPrice,
      proCategoryId,
      proSubCategoryId,
      proBrandId,
      proVariantTypeId,
      proVariantId,
      images: imageUrls,
    });

    // Send a success response back to the client
    res.json({
      success: true,
      message: 'Product created successfully.',
      data: null,
    });
  }

  // Update a product
  @Put('/:id')
  @ApiOperation({ summary: '编辑产品' })
  // @UseFilters(new ExceptionsLoggerFilter())
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 },
      ],
      {
        // storage: storageProduct,
        limits: {
          fileSize: 1024 * 1024 * 5, // limit filesize to 5MB
        },
      },
    ),
  )
  async update(
    @Param('id') productId: string,
    @Body() body,
    @Res() res: Response,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    const {
      name,
      description,
      quantity,
      price,
      offerPrice,
      proCategoryId,
      proSubCategoryId,
      proBrandId,
      proVariantTypeId,
      proVariantId,
    } = body;

    // Find the product by ID
    const productToUpdate = await this.productService.findOne(productId);
    if (!productToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found.' });
    }

    // Update product properties if provided
    productToUpdate.name = name || productToUpdate.name;
    productToUpdate.description = description || productToUpdate.description;
    productToUpdate.quantity = quantity || productToUpdate.quantity;
    productToUpdate.price = price || productToUpdate.price;
    productToUpdate.offerPrice = offerPrice || productToUpdate.offerPrice;
    productToUpdate.proCategoryId =
      proCategoryId || productToUpdate.proCategoryId;
    productToUpdate.proSubCategoryId =
      proSubCategoryId || productToUpdate.proSubCategoryId;
    productToUpdate.proBrandId = proBrandId || productToUpdate.proBrandId;
    productToUpdate.proVariantTypeId =
      proVariantTypeId || productToUpdate.proVariantTypeId;
    productToUpdate.proVariantId = proVariantId || productToUpdate.proVariantId;

    // Iterate over the file fields to update images
    const fields = ['image1', 'image2', 'image3', 'image4', 'image5'];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (files[field] && files[field].length > 0) {
        const file = files[field][0];
        const imageUrl = await this.toolsService.uploadFile(file, 'product');
        // Update the specific image URL in the images array
        const imageEntry = productToUpdate.images.find(
          (img) => img.image === index + 1,
        );
        if (imageEntry) {
          imageEntry.url = imageUrl;
        } else {
          // If the image entry does not exist, add it
          productToUpdate.images.push({ image: index + 1, url: imageUrl });
        }
      }
    }

    // Save the updated product
    await this.productService.update(productId, productToUpdate);
    res.json({ success: true, message: 'Product updated successfully.' });
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除产品' })
  async remove(@Param('id') id: string) {
    await this.productService.delete(id);
    return { success: true, message: 'Product deleted successfully.' };
  }
}
