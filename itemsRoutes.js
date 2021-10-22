const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

router.get('/', function (req, res, next) {
	res.send({items});
})

router.post('/', function (req, res, next)   {
	try {
    if (!req.body.name || !req.body.price) throw new ExpressError("Item is required", 400);
		
    const newItem = { name: req.body.name, price: req.body.price }
    items.push(newItem)
    return res.status(201).json({ added: newItem })
  } catch (e) {
    return next(e)
  }
})

router.get('/:name', function (req, res, next) {
	const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404)
  }
  res.json(foundItem)
})

router.patch('/:name', function (req, res, next) {
	const foundItem = items.find(item => item.name === req.params.name)
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
	if (req.body.name === undefined && req.body.price === undefined) {
		throw new ExpressError("No changes submitted by user", 406);
	}
	if (req.body.name !== undefined) foundItem.name = req.body.name;
	if (req.body.price !== undefined) foundItem.price = req.body.price;

  res.json({updated: foundItem})
})

router.delete('/:name', function (req, res, next) {
	const founditemIdx = items.findIndex(item => item.name === req.params.name)
	if (founditemIdx === -1) throw new ExpressError("Item not found", 404);
	
	items.splice(founditemIdx, 1);
	res.json({message: `${req.params.name} Deleted`})
})

module.exports = router;