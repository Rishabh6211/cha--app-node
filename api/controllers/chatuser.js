

import chatuserObj from '../models/chatuser';

module.exports = {

    saveUser: (req, res) => {
        let user = req.body.user;
        chatuserObj.findOne({user:user}).then((userdata => {
        	if(userdata==null){
		        chatuserObj(req.body).save().then((data => {
		        	if(!data){
		        		res.status(400).json({"message":"something went wrong"})
		        	}
		        	else{
		        		res.status(200).json({"message":"Successfully register","data":data})
		        	}

		        })) 
        	}else {
        		res.status(400).json({"message":"user already register "})


        	}

        }))
    },

    getUser:(req,res) => {
        let user = req.body.user;
        chatuserObj.findOne({user:user}).then((userdata => {
            if(userdata){
                console.log("userdata",userdata)
                let userId  =  userdata._id
                console.log("userId",userId)
                 let data = { $set: { isActive: true } };
                 chatuserObj.findByIdAndUpdate(userId,data).then((data)=>{
                    if(data){
                        res.status(200).json({"message":"Successfully login","data":userdata})
                    }
                    else{
                        res.status(400).json({"message":"something went wrong"})
                    }
                 })
            }
            else{
                res.status(400).json({"message":"user not register"})
            }
        }))
    },

    getAllUser:(req,res) => {
        chatuserObj.find({isActive: true}).then((data)=>{
            if(data){
                res.status(200).json({"message":"all register user","data":data})
            }
            else{
                res.status(400).json({"message":"user not listed"})
            }
        })
    }

    

};