const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
const uTag = require('../models/userTag');

router.get('/', validateToken, async (req, res) => {
  const tags = await Tag.find({ tag_state: /live/ }, 'tag_name');
  
  if(!tags.length) {
    res.status(200).json({"message": 'No tags found.'});
    return
  }

  res.status(200).json({"tags": tags});
});

router.post('/follow/', validateToken, async (req, res) => {
  const userID = req.user.id;
  const tag = req.body.tag_name;

  // Check if user already exists in DB
  let tags = await uTag.findOne({user_id: userID}, 'tags');

  // If so, get the list of all tags he is following and update.
  if(tags){
    tags = tags.tags;
    tags.push(tag);
    tags = [...new Set(tags)];

    await uTag.findOneAndUpdate({user_id: userID}, {tags: tags})
    
    return res.status(200).json({message: "Tag now followed by " + req.user.name});
  }

  // If not, create a new user entry with said TAG
  const newUserTag = new uTag({
    user_id: userID,
    tags: tag
  })

  try {
    await newUserTag.save()
    return res.status(201).json({ message: req.user.name + ' now following tag!' });
  } catch (err) {
    return res.status(401).json({message: 'An error occurred!'});
  }
});

router.post('/unfollow/', validateToken, async (req, res) => {
  const userID = req.user.id;
  const tag = req.body.tag_name;

  if(!tag) {
    return res.status(401).json({message: "The tag name is required!"});
  }
  
  let tags = await uTag.findOne({user_id: userID}, 'tags');

  if(!tags) {
    return res.status(401).json({message: "User doesn't follow any tags!!!"})
  }

  tags = tags.tags
  tags = tags.filter(value => value !== tag);

  await uTag.findOneAndUpdate({user_id: userID}, {tags: tags});

  res.status(200).json({message: "Tag unfollowed successfully!"});
});

module.exports = router