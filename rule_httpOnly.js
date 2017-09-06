//rule scheme :

module.exports = {
    replaceResponseHeader: function(req,res,header){
        header = header || {};
        const host = req.headers.host;
        if (/takeaway.51ping.com/.test(host)) {
          header["Set-Cookie"] = "dper=5c031971b086dfc9e5d9fad32eafb1e20908a0337bd5a033439df99c3ad3aa02; Path=/; HttpOnly";
        }
        return header;
    }
};