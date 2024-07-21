const API_RESPONSE = (statusCode,statusDescription,data,timestamp) =>{
    return {statusCode,statusDescription,data,timestamp:Date.now()}
}

module.exports={API_RESPONSE}