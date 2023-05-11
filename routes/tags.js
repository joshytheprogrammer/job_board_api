const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
const validateAdminToken = require('../middleware/validateAdminToken');
const Tag = require('../models/Tag');

router.post('/create', validateAdminToken, async (req, res) => {
  const { tag } = req.body;
  
  if(!tag) {
    return res.status(400).json({message: 'The tag object is required!'});
  }

  if (await Tag.findOne({tag_name: tag.name})){
    return res.status(400).json({message: 'Tag already exists'});
  }

  const newTag = new Tag({
    tag_name:  tag.name,
    tag_state: "live"
  });

  try {
    await newTag.save()
    res.status(201).json({ message: 'Tag created successfully!' });
  } catch (err) {
    res.status(401).json({message: 'An error occurred!'});
  }
  
});

router.post('/update', validateAdminToken, async (req, res) => {
  const old_tag_name = req.body.old_tag_name;
  const new_tag_name = req.body.new_tag_name;

  if(!old_tag_name) {
    return res.status(401).json({message: "The old name of the tag is required!"});
  }

  if(!new_tag_name) {
    return res.status(401).json({message: "The new name of the tag is required!"});
  }

  if(!await Tag.findOneAndUpdate({tag_name: old_tag_name}, {tag_name: new_tag_name})){
    return res.status(401).json({message: "We couldn't find the old tag"});
  }

  res.status(200).json({message: "Tag successfully updated"});
});

router.post('/delete', validateAdminToken, async (req, res) => {
  const tag_name = req.body.tag_name;

  if(!tag_name) {
    return res.status(401).json({message: "The tag name is required!"});
  }

  if(!await Tag.findOneAndDelete({tag_name: tag_name})) {
    return res.status(401).json({message: "We couldn't find the tag. No tag deleted!!!"});
  }

  res.status(200).json({message: "Tag successfully deleted"});
});

router.get('/all', validateAdminToken, async (req, res) => {
  const tags = await Tag.find({ tag_state: /live/ }, 'tag_name');
  
  if(!tags.length) {
    res.status(200).json({"message": 'No tags found.'});
    return
  }

  res.status(200).json({"tags": tags});
});

module.exports = router