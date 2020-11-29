module.exports=(res,code=500, err) => {
    res.status(code).json({success:false, message:err.message?err.message:error})
}