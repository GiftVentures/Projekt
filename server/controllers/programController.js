const Program = require('../models/programModel')
const User = require('../models/userModel')


const AddProgram = async (req, res) => {
    const { name, description, img, price, persons, location, theme, date } = req.body;
    const userId = req.user._id;
  
    try {
      const user = await User.findById(userId);
  
      if (!user || !user.isAdmin) {
        return res.status(403).json("Ez a művelet csak admin felhaználónak engedélyezett!");
      }
  
      const program = await Program.add(name, description, img, price, persons, location, theme, date);
  
      res.status(201).json("Program sikeresen felvéve");
    } catch (error) {
      console.error(error);
      res.status(500).json("Belső szerverhiba történt");
    }
  };

  const DeleteProgram = async (req, res) => {
    const programId = req.params.id;
    console.log("Received programId:", programId);
  
    try {
      const user = await User.findById(req.user._id);
  
      if (!user || !user.isAdmin) {
        return res.status(403).json("Ez a művelet csak admin felhaználónak engedélyezett!");
      }
  
      const deletedProgram = await Program.delete(programId);
  
      if (!deletedProgram) {
        return res.status(404).json("A program nem található");
      }
  
      res.status(200).json("Sikeres törlés");
    } catch (error) {
      console.error(error);
      res.status(500).json("Belső szerverhiba történt");
    }
  };

  module.exports = { AddProgram, DeleteProgram };
