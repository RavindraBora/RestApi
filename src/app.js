const express = require("express");
require("./db/conn");
const User = require("./modules/users");

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

app.post("/checkUser" , async(req,res) => {
    try {
        const userName = req?.body?.userName;
        if (userName != null && userName != undefined && userName != "") {
            const userId = await User.findOne(req.body);
            if (userId != null && userId != undefined && userId != "") {
                const response = {
                    "status" : "success",
                    "message" : "user found",
                    "user" : userId
                }
                res.status(200).send(response);

            } else {
                const response = {
                    "status" : "failed",
                    "message" : "No user found"
            }
            res.status(400).send(response);
            }
        } else {
            const response = {
                "status" : "failed",
                "message" : "Server did not recieve userId"
            }
            res.status(400).send(response);
        }

    } catch (error) {
        const response = {
            "status" : "failed",
            "message" :  e.message
        }
        res.status(400).send(response);
    }
})

app.post("/createUser" , async(req,res) => {
    try {
        const user = new User(req.body);
        const createUser = await user.save();
        const response = {
            "status" : "success",
            "message" : "User created successfully!",
            "user" : createUser
        }
        res.status(201).send(response);
    }
    catch (error) {
        const response = {
            "status" : "failed",
            "message" : error?.message,
        }
        res.status(400).send(response);
    }
})

app.post("/logIn", async(req,res) => {

    let errorMessage = "Some error occured";
    try {
        const { name, pass } = req.body;
        if (name != null && name != undefined && name != "" ) {
            const user = await User.findOne({ 'userName' : name });
            if (user != null && user != undefined && user != "") {
                if(user?.password == pass && pass != null && pass != undefined && pass != ""){
                    const response = {
                        "status" : "success",
                        "message" : "user login successfully",
                        "user" : user
                    }
                    res.status(200).send(response);
                }else{
                    errorMessage = "Password not matched";
                }
            }else{
                errorMessage = "User not found";
            }
        }else{
            errorMessage = "Server did not receive username";
        }
    } catch (error) {
       errorMessage = error?.message;
    }


    const response = {
        "status" : "failed",
        "message" : errorMessage
    }
    res.status(200).send(response);
})

app.post("/forgetPassword", async(req,res) => {

    let errorMessage = "Starting error";
    try {
        const name = req?.body?.name;
        const userEmail = req?.body?.userEmail;
        const newPass = req?.body?.newPass;
        const user = await User.findOne({ 'userName' : name });
        if (user != null && user != undefined && user != "" && user.email == userEmail) {
            console.log("user : "+ user);
            if (newPass != null && newPass != undefined && newPass != "" && newPass.length > 6 ) {
                console.log("new password : "+ newPass);
                User.findOneAndUpdate({ userName: name } , { $set: { password : newPass}})
                .then((updatedDoc) => {
                    console.log("updated doc : " + JSON.stringify(updatedDoc));
                    const response = {
                        "status" : true,
                        "message" : "Password changed successfully"
                    }
                    res.status(200).send(response);
                })
                .catch(err =>{ 
                    errorMessage = err?.message;
                    const response = {
                        "status" : false,
                        "message" : errorMessage
                    }
                    res.status(400).send(response);
                });
            }else{
                errorMessage = "entered password is not valid";
                const response = {
                    "status" : false,
                    "message" : errorMessage
                }
                res.status(400).send(response);
            }
        }else{
            errorMessage = "User not found";
            const response = {
                "status" : false,
                "message" : errorMessage
            }
            res.status(400).send(response);
        }
    } catch (error) {
        errorMessage = error?.message;
        const response = {
            "status" : false,
            "message" : errorMessage
        }
        res.status(400).send(response);
    }

    
})

app.post("/getAllUser" , async(req,res) => {
    try {
        const userData = await User.find();
        const response = {
            "status" : true,
            "message" : userData
        }
        res.status(200).send(response);
    } catch (error) {
        const response = {
            "status" : false,
            "message" : error
        }
        res.status(400).send(response);
    }
})

app.post("/filterData", async(req,res) => {
    try {
        const filterKey = req?.body?.filterKey;
        const filterType = req?.body?.filterType;

        if(filterKey != null && filterKey != undefined && filterKey != ""){
            if(filterType != null && filterType != undefined && filterType != ""){
                const userData = await User.find({[filterKey]:filterType});
                if(userData != null && userData != undefined && userData){
                    const response = {
                        "status" : "success",
                        "message" : "User found!",
                        "student" : userData
                    }
                    res.status(200).send(response);
                }

            }
        }
    } catch (error) {
        const response = {
            "status" : false,
            "message" : error
        }
        res.status(400).send(response);
    }
})

app.post("/searchData" , async(req,res) => {
    try{
        const searchKey = req?.body?.searchKey;
        const searchValue = req?.body?.searchValue;

        if (searchKey != null && searchKey != undefined && searchKey != "") {

            if (searchValue != null && searchValue != undefined && searchValue != "") {

                console.log("value : " + JSON.stringify(req.body));

                const query = {  $regex: new RegExp(searchValue, "i") };

                const searchQuery = {
                    [searchKey] : query
                }

                console.log("searchQuery value : " + JSON.stringify(searchQuery));

                const result = await User.find(searchQuery);

                if (result != null && result != undefined && result != "") {
                    const response = {
                        "Status":"Success",
                        "User": result
                    }
                    res.status(200).send(response)
                } else {
                    res.status(400)
                }
                
            } else {
                const response = {
                    "status" : "failed",
                    "message" :  "Value not found"
                }
                res.status(400).send(response);
            }
            
        } else {
            const response = {
                "status" : "failed",
                "message" :  "Key not found"
            }
            res.status(400).send(response);
        }
        
    }catch(e){
        const response = {
            "status" : "failed",
            "message" :  e.message
        }
        res.status(400).send(response);
    }
})

app.post("/sortData", async(req,res) => {
    try {
        const sortkey = req?.body?.sortkey;
        const sortValue = req?.body?.sortValue;
        const sortType = req?.body?.sortType;

        if (sortkey != null && sortkey != undefined && sortkey != "") {
            if (sortValue != null && sortValue != undefined && sortValue != "") {
                if(sortType != null && sortType != undefined && sortType != ""){
                    const FilteredQuery = {
                        [sortkey]:{[ sortValue == "greater" ?  "$gte" :"$lt"] : sortType}
                    }
                    const userData = await User.find(FilteredQuery);
                    if(userData != null && userData != undefined && userData){
                        const response = {
                            "status" : "success",
                            "message" : "User found!",
                            "student" : userData
                        }
                        res.status(200).send(response);
                    }
                }
            }
        }
    } catch (error) {
        const response = {
            "status" : false,
            "message" : error.message
        }
        res.status(400).send(response);
    }
})

app.post("/deleteUser" , async(req,res) =>{
    try {
        const name = req?.body?.name;
        if(name != null && name != undefined && name != ""){
            await User.deleteOne({ userName: name })
            const response = {
                "status" : true,
                "message" : "user deleted"
            }
            res.status(200).send(response);
        }
    } catch (error) {
        const response = {
            "status" : false,
            "message" : error.message
        }
        res.status(200).send(response);
    }
})

app.listen(port, () => {
    console.log(`connection is setup at ${port}`);
})