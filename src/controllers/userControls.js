const { admin, database } = require('../utils/firebase')
const chalk = require('chalk')
const FieldValue = require('firebase-admin').FieldValue;

var design = ['mobile app', 'website', 'tv interface', 'app interface'];
var forA = ['a restaurant in Brazil', 'a watch shop in Germany', 'a clothing shop in Dharavi', 'an ice cream parlour in Hawaii', 'a juice shop in Iceland', 'a tree in a desert', 'a book shop', 'bottle in San Jose', 'a devil in Heaven', 'a chair in IEEE']
var toHelp = ['a man in Brazil', 'to flash a torch', 'get groceries', 'animals get happy', 'redo an ML model', 'trains go faster', 'Pablo Escobar in Katpadi', 'relax your mind', 'too lazy to think', 'a chair in IEEE']

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        const userRef = database.collection('Users').doc(user.uid)
        userRef.set({
            uid: user.uid,
            email: user.email,
            name: user.name,
            task: "",
            link1: "",
            count: 10,
            submittedTask:false
        })
            .then((resp) => {
                console.log(chalk.green("New user details saved in db"))
                resolve({
                    statusCode: 200,
                    payload: {
                        msg: "User created.",
                    },
                    wasUserRegistered: false,
                    isRegSuccess: true,
                })
            })
            .catch((e) => {
                console.log(chalk.red("Error in saving user details to db"))
                reject({
                    statusCode: 400,
                    payload: {
                        msg: "Server Side error contact support"
                    },
                    wasUserRegistered: false,
                    isRegSuccess: false,
                })
            })

    })
}

const checkUserUid = (uid) => {
    console.log("checkuseruid")
    return new Promise((resolve, reject) => {
        admin.auth().getUser(uid)
            .then((resp) => {
                console.log(chalk.green("User uid verified!"))
                resolve(resp)
            })
            .catch((err) => {
                console.log(chalk.red("User UID Not verified from authentication!"))
                reject({ error: err.message, message: "Unauthorised" })
            })
    })
}

const checkUserObject = (uid, resp) => {
    return new Promise(async (resolve, reject) => {
        console.log("Entered checkUserObject")
        const userRef = await database.collection('Users').doc(uid)
        console.log("wait")
        userRef.get()
            .then((docSnapshot) => {
                console.log("got docSnapshot")
                if (docSnapshot.exists) {
                    console.log(docSnapshot.exists)
                    resolve({
                        statusCode: 200,
                        payload: {
                            msg: "User Checked",
                            responce: resp
                        }
                    })
                }
            })
            .catch((err) => {
                console.log(chalk.red("User uid un-verified from database!"))
                reject({
                    statusCode: 400,
                    error: err.message,
                    message: "Unauthorised"
                })
            })
    })
}

const getUserInfo = (uid) => {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow("Getting user info..."))
        const userRef = database.collection('Users').doc(uid)
        userRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    userRef.onSnapshot((doc) => {
                        console.log(chalk.green("User exists!"));
                        console.log(doc._fieldsProto)
                        resolve(true)
                    });
                }
                else {
                    resolve(false)
                }
            }).catch((err) => {
                console.log(chalk.red("Error in fetching user details!"));
                reject(err)
            })
    })
}

const createProblemStatement = (uid, isLock1, isLock2, isLock3) => {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(chalk.yellow("Getting new problem statement..."))
            const userRef = await database.collection('Users').doc(uid).get().then((doc)=> {
                count = doc.data().count
            })
            if(count > 0) {
                if(isLock1===false) {
                    newDesign = design[Math.floor(Math.random() * 4)]
                } else {
                    newDesign = "Locked"
                }
                if(isLock2===false) {
                    newTo = forA[Math.floor(Math.random() * 10)]
                } else {
                    newTo = "Locked"
                }
                if(isLock3===false) {
                    newToHelp = toHelp[Math.floor(Math.random() * 5)]
                } else {
                    newToHelp = "Locked"
                }
                resolve({
                    payload: {
                        newDesign: newDesign,
                        newTo: newTo,
                        newToHelp: newToHelp,
                        count: count
                    }
                })
                const userRef = await database.collection('Users').doc(uid).update({count : admin.firestore.FieldValue.increment(-1) })
            } else {
                resolve({
                    payload: {
                        count: "0",
                        message: "No more tries left"
                    }
                })
            }
        } catch(e) {
            reject({
                payload: {
                    message: "Something went wrong with generating problem statement. Please try again"
                }
            })
        }
    })
}

const lockProblem = (uid, value1, value2, value3) => {
    return new Promise(async(resolve, reject) => {
        try {
            task = "Design a "+value1+" for "+value2+" to help "+value3;
            const userRef = await database.collection('Users').doc(uid).update({
                task:task,
                submittedTask:true,
                design:value1,
                forA:value2,
                toHelp:value3
            })
            resolve({
                payload: {
                    message: "Successfully stored task"
                }
            })
        } catch(e) {
            console.log(e);
            reject({
                payload: {
                    message: "Not saved task. Please try again"
                }
            })
        }
        
    })
}

const submitLink = (uid, link) => {
    return new Promise(async(resolve, reject) => {
        try {
            const userRef = await database.collection('Users').doc(uid).update({link1:link});
            resolve({
                payload: {
                    message: "Successfully stored link"
                }
            })
        } catch(e) {
            reject({
                payload: {
                    message: "Not saved link. Please try again"
                }
            })
        }
    })
}

const promises = []
const addCount = () => {
    return new Promise(async(resolve, reject) => {
        const userRef = await database.collection('Users').get()
        .then(snapshot => {
            const promises = []
            snapshot.forEach(doc => {
                promises.push(doc.ref.set({
                    count:5,
                    submittedTask:false
                }))
            })
        })
        await Promise.all(promises)
        resolve({
            payload: {
                "done":"done"
            }
        })
    })
}

const getSubmittedParticipants = () => {
    return new Promise(async(resolve, reject) => {
        const userRef = await database.collection('Users').get()
        .then(snapshot => {
            // console.log(snapshot);
            snapshot.forEach(doc => {
                console.log(doc.data.toString());
            });
        })
        resolve({
            payload: {
                "done":"done"
            }
        })
    })
}

const checkIfTaskSubmitted = (uid) => {
    return new Promise(async(resolve, reject) => {
        const userRef = await database.collection('Users').doc(uid).get().then((doc)=> {
            count = doc.data().count
            submittedTask = doc.data().submittedTask,
            design = doc.data().design,
            forA = doc.data().forA,
            toHelp = doc.data().toHelp
        })
        resolve({
            payload: {
                count:count,
                submittedTask:submittedTask,
                design:design,
                forA:forA,
                toHelp:toHelp
            }
        })
    })
}

function listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    return new Promise(async(resolve, reject) => {
    await admin.auth().listUsers(1000, nextPageToken)
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          console.log('user', userRecord.toJSON().email);
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
      });
      resolve({
        payload: {
            "done":"done"
        }
    })
  });
}
  

module.exports = {
    createUser,
    checkUserUid,
    getUserInfo,
    checkUserObject,
    createProblemStatement,
    lockProblem,
    submitLink,
    addCount,
    checkIfTaskSubmitted,
    getSubmittedParticipants,
    listAllUsers,
}