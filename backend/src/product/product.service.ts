import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductCategory } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, LessThanOrEqual, MoreThanOrEqual, Between, FindOptionsWhere } from 'typeorm'; // הוספתי FindOptionsWhere
import { CartItem } from '../cart/entities/cartItem.entity';
import { ProductFilterDto } from './dto/product-filter.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { IsNull, Not } from 'typeorm'
import { Category } from './entities/category.entity';
import { createCategoryDto } from './dto/create-category.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,

        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,

        private readonly cloudi: CloudinaryService,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    async createCategory(categoryDto: createCategoryDto){
      const existingCAte = await this.categoryRepo.findOneBy({name: categoryDto.name})
      if(existingCAte) throw new ConflictException(`הקטגוריה כבר קיימת במערכת`)
        const newCategory = this.categoryRepo.create(categoryDto)
      return await this.categoryRepo.save(newCategory)
    }
    async findAllCategories() {
        return await this.categoryRepo.find();
    }
    async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
        const category = await this.categoryRepo.findOneBy({ categoryId: createProductDto.categoryId });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
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
            category: category
        });

        return await this.productRepo.save(newProduct);
    }

    async findAll() {
        return this.productRepo.find({
          relations: ['category']
        });
    }

    async findOne(id: number) {
        const product = await this.productRepo.findOne({ where: { productId: id }, relations: ['category'] });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // --- ⭐ התיקון של פונקציית הסינון ⭐ ---
    async findWithFilter(filterDto: ProductFilterDto) {
        const { search, categoryId, minPrice, maxPrice } = filterDto; // שים לב: categoryId ב-FilterDto
        
        const where: FindOptionsWhere<Product> = {};

        if (search) {
            where.name = ILike(`%${search}%`);
        }

        // תיקון הסינון לפי קטגוריה (Relation)
        if (categoryId) {
            where.category = { categoryId: Number(categoryId) };
        }

        // ... המשך לוגיקת מחירים אותו דבר ...
        const min = minPrice ? Number(minPrice) : undefined;
        const max = maxPrice ? Number(maxPrice) : undefined;

        if (min !== undefined && max !== undefined) {
            where.price = Between(min, max);
        } else if (min !== undefined) {
            where.price = MoreThanOrEqual(min);
        } else if (max !== undefined) {
            where.price = LessThanOrEqual(max);
        }

        return await this.productRepo.find({
            where: where,
            order: { price: 'ASC' },
            relations: ['category'] // חשוב! כדי לקבל את פרטי הקטגוריה בתוצאה
        });
    }
    // ... שאר הפונקציות נשארות אותו דבר ...

    async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File) {
        const product = await this.productRepo.findOneBy({ productId: id });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        if (updateProductDto.categoryId) {
            const newCategory = await this.categoryRepo.findOneBy({ categoryId: updateProductDto.categoryId });
            if (newCategory) {
                product.category = newCategory;
            }
        }

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
            where: { deletedAt: Not(IsNull()) },
            relations: ['category']
            
        });
    }
}