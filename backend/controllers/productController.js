const Product = require('../models/Product');

// @desc Get all products with search/filter/pagination
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const filter = { ...keyword, ...category };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize).skip(pageSize * (page - 1)).sort('-createdAt');

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Create review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return res.status(400).json({ message: 'Already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Admin: Create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Admin: Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Admin: Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) res.json({ message: 'Product removed' });
    else res.status(404).json({ message: 'Product not found' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getProducts, getProductById, getFeaturedProducts, getCategories,
  createReview, createProduct, updateProduct, deleteProduct
};
