import contactModel from "../models/contact.model.js";
import { sendContactNotificationEmail } from "../utils/emailSend.js";

//create contact
export const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const contact = new contactModel({ name, email, message });
    await contact.save();

    // Send email notification to admin
    await sendContactNotificationEmail({ name, email, message });

    res.status(201).send('Contact created successfully');
  } catch (error) {
    next(error);
  }
};

//get all contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactModel.find();
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};
