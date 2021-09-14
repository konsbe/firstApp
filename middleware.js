const User = require('./models/user')



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be sign in first')
        return res.redirect('/login');
    }
    next();
}

// module.exports.isAdmin = async(req, res, next) => {
//     const { id } = req.params
//     const logUser = await User.findById(id);
//     if (!req.isAuthenticated()) {
//         if (User._id != "6140ae6f0b1735855cfc1c90") {
//             req.flash('error', 'Only for admins');
//             return res.redirect('/login');
//         }
//         next();

//     }
//     next();
// }
// module.exports.isAdmin = async(req, res, next) => {
//     const { id } = req.params
//     const logUser = await User.findById(id);
//     if (req.isAuthenticated() || User._id !== "6140ae6f0b1735855cfc1c90") {
        
//             req.flash('error', 'Only for admins');
//             return res.redirect('/login');
//         }
//         next();

// }
    
module.exports.isAdmin = async(req, res, next) => {
    const { id } = req.params
    const logUser = await User.findById(id);
    if (req.isAuthenticated()) {
            if (req.user._id != "6140ae6f0b1735855cfc1c90") {
                req.flash('error', 'Only for admins');
                return res.redirect('/login');        
            }
        return next();
        
        
    }
    req.flash('error', 'You must be sign in first')
    return res.redirect('/login');

}


// module.exports.isAdmin = async(req, res, next) => {
//     const { id } = req.params
//     const logUser = await User.findById(id);
//     if (isLoggedIn) {
//         if (User._id !== "6140ae6f0b1735855cfc1c90"){
        
//             req.flash('error', 'Only for admins');
//             return res.redirect('/login');
//         }
//         next();

//     }
// }
