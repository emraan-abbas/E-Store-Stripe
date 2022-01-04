const Product = require('../models/product.model');
const fs = require('fs');
const stripe = require('stripe')(
	'sk_test_51KCeptA1IXnqbjZIXa0xJJjQep905UElz2eFdaskFHvY3OBRifVj220gyHIvscrciUE4zzmEJbJouQmFJAsDZVWx00koSEdGL4'
); //process.env.STRIPE_PRIVATE_KEY

// Creating Product
exports.create = async (req, res) => {
	try {
		//Validating Body
		if (!req.body) {
			return res.status(400).send({
				message: 'Please Enter Some Data',
			});
		}
		// ELSE
		const product = await new Product({
			name: req.body.name,
			imageUrl: req.file.path,
			price: req.body.price,
			detail: req.body.detail,
			quantity: req.body.quantity,
		});
		await product.save();
		return res.status(200).json({ message: 'Product Added Successfully !', product });
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Creating Product !' || error,
		});
	}
};
// Creates Ends Here

// ------------------------------ //

// Get All Products
exports.findAll = async (req, res) => {
	try {
		const products = await Product.find().select('_id name imageUrl price detail quantity');
		return res.status(200).json({
			products,
		});
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Getting All Products !' || error,
		});
	}
};
// Get All Ends Here

// ------------------------------ //

// Get One Product
exports.findOne = async (req, res) => {
	try {
		const product = await Product.findById({ _id: req.params.id }).select(
			'_id name imageUrl price detail quantity'
		);
		return res.status(200).json({
			product,
		});
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Getting One Product !' || error,
		});
	}
};
// Get All Ends Here

// ------------------------------ //

// Delete a Product
exports.delete = async (req, res) => {
	try {
		// Deleting Image
		const url = await Product.findById({ _id: req.params.id });
		const img = url.imageUrl;
		fs.unlink(img, (err) => {
			if (err) {
				throw err;
			}
		});
		// Deleting Data
		const product = await Product.deleteOne({ _id: req.params.id });
		return res.status(200).json({
			product,
			message: 'Deleted !',
		});
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Deleting Product !' || error,
		});
	}
};
// Delete Ends Here

// ------------------------------ //

// Update a Product
exports.update = async (req, res) => {
	try {
		// Updating Image
		// const url = await Product.findById({ _id: req.params.id });
		// const img = url.imageUrl;
		// fs.writeFile(img, function (err) {
		// 	if (err) {
		// 		throw err;
		// 	}
		// 	else{

		// 	}
		// });
		// Updating Data
		const product = await Product.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					name: req.body.name,
					imageUrl: req.file.path,
					price: req.body.price,
					detail: req.body.detail,
					quantity: req.body.quantity,
				},
			}
		);
		if (product) {
			return res.status(200).json({
				message: product,
			});
		} else {
			return res.status(401).json({
				message: 'Error',
			});
		}
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Updating Product !' || error,
		});
	}
};
// Update Ends Here

// ------------------------------ //

// Checkout Here
exports.payment = async (req, res) => {
	try {
		const domain = 'http://localhost:3000';
		const { product } = req.body;
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'pkr',
						product_data: {
							name: 'Book',
						},
						unit_amount: 1000 * 100,
					},
					quantity: 2,
				},
			],
			mode: 'payment',
			success_url: `${domain}/success.html`,
			cancel_url: `${domain}/cancel.html`,
		});

		console.log(session, 'hereeeee');
		res.redirect(303, session.url);
	} catch (error) {
		console.log(error);
		return res.status(401).json({
			message: 'Error at Checkout !' || error,
		});
	}
};
// Checkout Ends Here
