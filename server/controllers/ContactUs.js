


const   contactUsController=async () => {
    try{
        console.log("hwey i am inside contactuscontrooler")
        return  res.status(200).json({
            status:true,
            message:"contact us"
        })

    }
    catch(e)
    {
        console.log("error in contact us contrroler",e.error);
        return  res.status(500).json({
            status:false,
            message:e.message
        })
    }
}
     
module.exports={
    contactUsController
}