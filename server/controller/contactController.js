const Contact = require("../model/Contact")
const AddContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    return res.json({
      message: "Contact created contact",
      status: true
    });
  } catch (err) {
    return res.json({
      message: "Error while create contact",
      status: false,
    });
  }
};


const GetContact = async (req, res) => {
  try {

    const contact = await Contact.find()

    return res.json({
      message: "Contact get success",
      contact: contact,
      status:true
    });
  
  }
  catch (err) {
    console.log(err);


    return res.json({
      message: "Error while Fetch",
      status: false,
    });
  }
}


const UpdateContact = async (req, res) => {
  try {
     
    const updatedConcat = await Contact.findByIdAndUpdate(req.params.id, req.body);
    return res.json({
      message: "Updated successfully",
      status: true,
      updatedConcat
    });
  } catch (err) {
    return res.json({
      message: "Error while update",
      status: false,
    });
  }
  
}

const DeleteContact = async (req, res) => {
  try {
     
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Deleted successfull",
      status: true,
      deletedContact,
     
    });
  } catch (err) {
    console.log(err)
    return res.json({
      message: "Error while delete",
      status: false,
    });
  }
  
}

  module.exports = {
    AddContact,
    GetContact,
    UpdateContact,
    DeleteContact
  };