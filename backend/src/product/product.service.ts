import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductCategory } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, LessThanOrEqual, MoreThanOrEqual, Between, FindOptionsWhere } from 'typeorm'; // הוספתי FindOptionsWhere
import { CartItem } from '../cart/entities/cartItem.entity';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { IsNull, Not } from 'typeorm'

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,
        private readonly cloudi: CloudinaryService
    ) { }

    // ... create נשאר אותו דבר ...
    async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
        let finalImageUrl: string | null = null;

        if (file) {
            try {
                const uploadRes = await this.cloudi.uploadImage(file);
                finalImageUrl = uploadRes.secure_url;
            } catch (error) {
                console.error("❌ [Cloudinary] Upload Failed:", error);
            }
        }

        const newProduct = this.productRepo.create({
            ...createProductDto,
            imageUrl: finalImageUrl,
            price: Number(createProductDto.price),
            stockQuantity: Number(createProductDto.stockQuantity),
        });

        return await this.productRepo.save(newProduct);
    }

    async findAll() {
        return this.productRepo.find();
    }

    async findOne(id: number) {
        const product = await this.productRepo.findOne({ where: { productId: id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // --- ⭐ התיקון של פונקציית הסינון ⭐ ---
    async findWithFilter(filterDto: ProductFilterDto) {
        const { search, category, minPrice, maxPrice } = filterDto;
        
        // אנחנו בונים אובייקט אחד במקום מערך כדי ליצור לוגיקת AND
        const where: FindOptionsWhere<Product> = {};

        // 1. סינון לפי שם (חיפוש חופשי)
        if (search) {
            where.name = ILike(`%${search}%`);
        }

        // 2. סינון לפי קטגוריה
        if (category) {
            where.category = category;
        }

        // 3. סינון לפי מחיר
        // חשוב לוודא שהמספרים הם באמת מספרים (לפעמים מגיעים כסטרינג מה-Query)
        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;

        if (min !== undefined && max !== undefined) {
            where.price = Between(min, max);
        } else if (min !== undefined) {
            where.price = MoreThanOrEqual(min);
        } else if (max !== undefined) {
            where.price = LessThanOrEqual(max);
        }

        // ביצוע השאילתה
        const products = await this.productRepo.find({
            where: where,       // אם האובייקט ריק, הוא יחזיר את הכל (וזה תקין)
            order: { price: 'ASC' } // מיון ברירת מחדל לפי מחיר עולה
        });

        // החזרה של מערך ריק עדיפה על החזרת אובייקט עם הודעה
        // כי הפרונטאנד מצפה למערך כדי לעשות .map
        return products;
    }

    // ... שאר הפונקציות נשארות אותו דבר ...

    async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File) {
        const product = await this.productRepo.findOneBy({ productId: id });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);

        if (file) {
            try {
                const newImageUrl = await this.cloudi.uploadImage(file);
                product.imageUrl = newImageUrl.secure_url || newImageUrl.url;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
            }
        }

        const safeUpdateData = { ...updateProductDto };
        if (safeUpdateData.price) safeUpdateData.price = Number(safeUpdateData.price);
        if (safeUpdateData.stockQuantity) safeUpdateData.stockQuantity = Number(safeUpdateData.stockQuantity);

        Object.assign(product, safeUpdateData);
        return this.productRepo.save(product);
    }

    async remove(id: number) {
        const result = await this.productRepo.softDelete(id);
        if (result.affected === 0) throw new NotFoundException(`Product with ID ${id} not found`);
        await this.cartItemRepo.delete({ product: { productId: id } });
        return { message: `Product with ID ${id} deleted successfully` };
    }

    async restore(id: number) {
        const result = await this.productRepo.restore(id);
        if (result.affected === 0) throw new NotFoundException(`product with ID ${id} not found`);
        return this.productRepo.findOne({ where: { productId: id } });
    }

    findDeleted() {
        return this.productRepo.find({
            withDeleted: true,
            where: { deletedAt: Not(IsNull()) }
        });
    }
}