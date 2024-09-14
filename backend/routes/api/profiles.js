const express = require('express');

const router = express.Router();
const User = require('../../models/Profile');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');

const validateProfileInput = require('../../validation/profile');
const passport = require('passport');

//@route    GET api/profiles
//@desc     Create Profiles 
//@access   Private
router.get('/', auth, (req, res) => {
  let errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('users', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = "Profile does not exist for this user."
        return res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(500).json(err))
})

//@route    POST api/profiles
//@desc     Create or Edit Profiles 
//@access   Private
router.post('/', auth, (req, res) => {
  //Check if register inputs are valid
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors)
  }
  const profileFields = {};
  profileFields.user = req.user.id;
  profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  profileFields.skills = req.body.skills.split(',');

  //Social inputs
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        //update profile
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile))
      } else {
        //create profile
        //check if handle already exists
        Profile.findOne({ handle: req.user.handle })
          .then(profile => {
            if (profile) {
              errors.handle = "Handle already exists. Try to use another handle."
              res.status(400).json(errors)
            }

            //save profile
            new Profile(profileFields).save()
              .then(profile => res.json(profile))
          })
      }
    })

})

module.exports = router;