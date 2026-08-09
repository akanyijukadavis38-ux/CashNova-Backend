const jwt = require("jsonwebtoken");


// =====================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================

function adminAuth(req, res, next){

    try{

        const authHeader =
            req.headers.authorization;


        if(!authHeader){

            return res.status(401).json({

                message:"Admin authentication required"

            });

        }


        if(!authHeader.startsWith("Bearer ")){

            return res.status(401).json({

                message:"Invalid authentication format"

            });

        }


        const token =
            authHeader.split(" ")[1];


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        if(!decoded.isAdmin){

            return res.status(403).json({

                message:"Administrator access required"

            });

        }


        req.admin = decoded;


        next();


    }catch(error){

        console.log(
            "Admin authentication error:",
            error.message
        );


        return res.status(401).json({

            message:"Invalid or expired admin session"

        });

    }

}


module.exports = adminAuth;
