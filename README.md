# KathPutli

Created by: [Aditi Gupta](https://github.com/itida99), [Ayush Misra](https://github.com/Ayush-0801) and [Yatharth Taneja](https://github.com/yatharthtaneja)

## Overview

**KathPutli** is an AR Puppetry experience developed in Java. The AR characters are inspired by real life objects and have animations that can be triggered by voice cues. Currently the project is a working prototype and hence have limited characters and voice cues.

The project was developed as part of coursework of the Designing Interactive Systems course at IIIT Delhi.

**Live demo of the project can be found [here](https://yatharthtaneja.github.io/Kathputli-js/)** 

**Video demo of the project can be found [here](https://youtu.be/244WTQ-TyfM)**

## Usage

1. ### Scan objects

   Click on <u>Scan Character</u> to scan daily live objects. You can scan up to three objects and AR characters inspired by those objects will available to you. Currently AR characters for  4 daily life objects are implemented: *Spoon, Cup, Bottle and Remote.*

   <img src = "img/Kathputli _ An AR Puppetry Experience 0-41 screenshot.png">

2. ### Click Play

   Character 1 and Character 2 will be loaded on both of your hands attached near the wrist. The characters will scale up according to the proximity to the camera to to create the AR effect. You can move the character's arms by using your fingers. The following guide will help:

   - Index finger controls the left arm of the character
   - Ring finger controls the right arm of the character
   - Rotate the character by making a fist

   <img src = "img/Kathputli _ An AR Puppetry Experience 2-38 screenshot.png">

3. ### Use voice ques

   Certain voice queues trigger certain animations in certain characters. Currently there is no user interface to change the voice queues for the animations but one can make edits in the code in `speech.js` in the `commands` variable.  The following animations are available for the specific characters. 

   - Cup: Screaming, Dropping
   - Spoon: Dancing, Talking
   - Bottle: Make fun, Crying

   #### Change Character

   This voice queue will replace character 2 with character 3.

## Project Setup

1. `git clone https://github.com/yatharthtaneja/Kathputli-js.git`
2. Run index.html on live server

## Future Scope

- Make user interface to add custom voice queues
- Increase the number of characters
- Allow more than three characters to scan