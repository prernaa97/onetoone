import express from 'express'

import User from './models/user.js';
import Profile from './models/profile.js';
import sequelize from './db.js';


const app=express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

User.hasOne(Profile,{foreignKey:'userId',onDelete:'CASCADE'});
Profile.belongsTo(User,{foreignKey:'userId'});

sequelize.sync({force:false}).then(()=>{   //whenever we make any changes in the constraints then we have to set force as true then after creating make it false
    console.log("databased synced")
});

app.get('/',(req,res)=>{
    res.send("welcome")
})

// app.post('/create',async(req,res)=>{
//     console.log('arr bhai',req.body)
//     const {uname,profile}=req.body;
//     try{
//         const user=await User.create({
//             uname,
//             Profile:profile
//         },
//         {
//             include:[Profile]
//         });
//         res.status(201).json({user})
//     }catch(err){
//         res.status(404).send(err)
//     }
// })


app.post('/create', async (req, res) => {
    console.log('arr bhai', req.body);

    try {
        const user = await User.create(req.body, {
            include: [Profile]
        });

        res.status(201).json({ user });
    } catch (err) {
        console.error(err); 
        res.status(500).send("Error creating user with profile");
    }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Profile });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error is there");
  }
});


app.put("/user/:id", async (req, res) => {
  const { uname, profile } = req.body;
  try {
    const user = await User.findByPk(req.params.id, { include: Profile });

    if (!user) {
      return res.status(404).send("User not found");
    }

    
    if (uname) {
      user.uname = uname;
      await user.save();
    }

    
    if (profile ) {
      if (profile.bio) {
        user.Profile.bio = profile.bio;
      }
      if (profile.age) {
        user.Profile.age = profile.age;
      }
      await user.Profile.save();
    }

    res.json( {message: "User and profile is updated ",user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error is there");
  }
});

app.delete("/user/:id",async (req,res)=>{
  try {
    const user = await User.findByPk(req.params.id, { include: Profile });

    if (!user) {
      return res.status(404).send("User not found");
    }
    await user.destroy();
    res.send("user deleted")
  }
  
    catch(err){
      res.send("error is there")
    }

});


app.listen(3000,()=>{
    console.log("server started");
});