const employeeModel = require("../model/Employee");


class EmployeeContronller {
  //lấy danh sách nhân viên
    async getEmployee(req, res) {
      try {
          const employee = await employeeModel.find();
          res.status(200).json(employee);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving employee", error });
        }
      }

  //được gọi ở user khi tạo 1 user mới
  async createEmployeeFromUser(req, res) {
    console.log("Request body:", req.body); // Thêm dòng này để kiểm tra dữ liệu nhận được
    const { email, firstName, lastName, role, idUser } = req.body;
    try {
      const employeeFromUser = new employeeModel({
        _id: idUser,
        name: `${firstName} ${lastName}`,
        email,
        position: role,
        basicSalary: 23000,
      });
      await employeeFromUser.save();
      res.status(200).json(employeeFromUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating employee from user", error });
    }
  }
  //được gọi ở user khi edit user khi edit 1 user
  async updateEmployeeFromUser(req, res) {
    const { id } = req.params;
    const { email, firstName, lastName, role } = req.body;
    try {
      const updateEmployee = await employeeModel.findByIdAndUpdate(
        id,
        {
          email,
          name: `${firstName} ${lastName}`,
          position: role,
        },
        { new: true, runValidators: true }
      );
      if (!updateEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json(updateEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Error updating employee" });
    }
  } 
  
  //Tạo nhân viên mới
  async createNewEmployee(req, res) {
    const { email, name, address, phonenumber, position, basicSalary, entryDate,  } = req.body

    if(!name || !phonenumber || !address || !email) {
      return res.status(400).json({message: "Missing required fields"})
    }
    try {
      const existingEmail = await employeeModel.findOne({ email});
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const existingPhone = await employeeModel.findOne({ phonenumber});
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if(phonenumber.length !== 10)
        return res.status(400).json({ message: "Phone number must have 10 digits" });
    
      const newEmployee = new employeeModel({
        email,
        name,
        address,
        phonenumber,
        position,
        basicSalary,
        entryDate
      })
      await newEmployee.save()
      res.json(newEmployee)
    } catch(error) {
        res.status(500).json({message: "Error creating employee", error})
    }
  }
  //update nhân viên
  async updateEmployee (req, res) {
    const { id } = req.params;
    const { name, email, address, phonenumber, entryDate, basicSalary, position, status } = req.body;
    if(phonenumber.length !== 10)
      return res.status(403).json({ message: "Phone number must be 10 digits" });
    try {
      const isPhone = await employeeModel.findOne({ phonenumber, _id: { $ne: id } });
      if(isPhone)
        return res.status(404).json({ message: "This phone number is already in use " });

      const updateEmployee = await employeeModel.findByIdAndUpdate (
        id, 
        {name, email, address, phonenumber, entryDate, basicSalary, position, status},
        { new: true, runValidators: true },
      );

      if (!updateEmployee){
        return res.status(400).json({ message: "employee not found" });
      }
      res.status(200).json(updateEmployee);
    } catch {
      res.status(500).json({message: "Error updating employee"})
    }
  } 

  //lấy thông tin chi tiết của nhân viên theo id
      async getEmployeeById(req, res) {
        const { id } = req.params;
        try {
          const employee = await employeeModel.findById(id);
    
          if (!employee) {
            return res.status(404).json({ message: "employee not found" });
          }
    
          res.status(200).json(employee);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving employee", error });
        }
      }

      //Xoa nhân viên
      async deleteEmployee (req, res) {
        const { id } = req.params
        try {
          const deleteEmployee = await employeeModel.findByIdAndDelete(id)
          if(!deleteEmployee){
            return res.json(400).json({message: "employee not found"})
          }
          res.status(200).json("Deleted")
        } catch {
          res.status(500).json({message: "Error deleting employee"})
        }
      }
  }
module.exports = new EmployeeContronller();