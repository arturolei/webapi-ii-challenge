const express = require('express');
const db = require('./db.js');
const router = express.Router();


//POST - make post
router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."});
    } else {
        db.insert(req.body)
        .then(()=>{
            res.status(201).json(req.body);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }

});

//POST Make Comment
/*
router.post('/:id/comments', (req,res) => {

})*/


//GET Posts Request
router.get('/', async (req, res) => {
    try {
      const posts = await db.find();
      
      res.status(200).json(posts);
    } catch (error) {
     
      res.status(500).json({
        message: 'Error retrieving the hubs',
      });
    }
  });

//GET by ID Request

router.get('/:id', async(req, res) =>{
   db.findById(req.params.id).then(post => {
        if(post.length > 0){ //Why does it have to be length? That is weird.
            res.status(200).json(post);
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
     }
    
    ).catch( error => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
   
})

//GET comments by message

router.get('/:id/comments', async (req,res) => {
    try {
        const comments = await db.findPostComments(req.params.id);
        if(comments) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    }  catch (error){
        console.log(error);
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
      const count = await db.remove(req.params.id);
      if (count > 0) {
        res.status(200).json({ message: 'The post has been deleted' });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    } catch (err) {
      res.status(500).json({error: "The post could not be removed" });
    }
  });

//PUT - update post 

router.put('/:id',(request, response)=>{
    const {id} = request.params;
    const postBody = request.body;
    const {title, contents} = request.body;
    
    if(!title || !contents){
        response.status(400).json({errorMessage: "Please provide title and contents for the post." })
    } else {
        db.update(id, postBody)
        .then(updatedPost => {
            if(updatedPost){
                response.status(200).json(request.body);
            } else {
                response.status(404).json({ message: "The post with the specified ID does not exist." });
            }
    
        })
        .catch(err =>{
            response.status(500).json({ error: "The user information could not be modified." })
        });
    }
    
 
})





module.exports =  router;