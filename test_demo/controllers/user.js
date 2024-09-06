import User from "../models/user.js"
import bcrypt from "bcryptjs"
import joi from "joi"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
    const { compareSync } = bcrypt
    try {
        const { email, password } = req.body

        const loginSchema = joi.object({
            email: joi.string().email().min(3).max(32).required().messages({
                "string.email": "Định dạng email không hợp lệ!",
                "string.min": "Email phải có ít nhất 3 ký tự!",
                "string.max": "Email không được vượt quá 32 ký tự!"
            }),
            password: joi.string().min(6).max(32).required().messages({
                "string.password": "Định dạng mật khẩu không hợp lệ!",
                "string.min": "Mật khẩu phải có ít nhất 6 ký tự!",
                "string.max": "Mật khẩu không được vượt quá 32 ký tự!"
            }),
        })

        const validate = loginSchema.validate({ email, password })

        if (validate.error) {
            return res.status(400).json({
                error: validate.error.details[0].message
            })
        }
        const findUser = await User.findOne({ email }).lean()
        if (!findUser) {
            return res.status(402).json({ error: "Email không tồn tại!" })
        }

        const checkPassword = compareSync(password, findUser.password)
        const accessToken = jwt.sign({
            id: findUser._id,
        }, process.env.SECRET_KEY, { expiresIn: '1d' })
        const {
            password: userPassword,
            ...returnUser
        } = findUser

        if (!checkPassword) {
            return res.status(401).json({
                error: "Mật khẩu không chính xác!"
            })
        }

        if (findUser) {
            return res.status(200).json({
                message: "Đăng nhập thành công.",
                user: returnUser,
                accessToken
            })
        }

    } catch (error) {
        return res.status(500).json({ message: "Đăng nhập thất bại! Vui lòng kiểm tra lại!" })

    }
}
export const createUser = async (req, res) => {
    const { hashSync, genSaltSync } = bcrypt;
    try {
        const data = req.body
        const { email, password } = data
        const createSchema = joi.object({
            name: joi.string().required().messages({
                'string.empty': 'Tên người dùng là bắt buộc!',
            }),
            age: joi.string().min(1).max(100).required().messages({
                'number.base': 'Tuổi phải là một số!',
                'number.min': 'Tuổi phải lớn hơn hoặc bằng 1!',
                'number.max': 'Tuổi phải nhỏ hơn hoặc bằng 100!',
                'any.required': 'Tuổi là bắt buộc!',
            }),
            gender: joi.boolean().required().messages({
                'boolean.empty': 'Giới tính là bắt buộc!',
            }),
            email: joi.string().email().required().messages({
                'string.email': 'Email không hợp lệ!',
                'string.empty': 'Email là bắt buộc!',
            }),
            password: joi.string().min(6).required().messages({
                'string.min': 'Mật khẩu phải có ít nhất 6 ký tự!',
                'string.empty': 'Mật khẩu là bắt buộc!',
            }),
        });

        const { error } = createSchema.validate(data)
        if (error) {
            return res.status(400).json({
                error: error.details.map((e) => e.message),
            });
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(401).json({ message: "Email này đã được sử dụng!" })
        }

        const salt = genSaltSync();
        const hashedPassword = hashSync(password, salt);

        const result = User.create({ ...data, password: hashedPassword })

        return res.status(200).json({
            message: 'Tạo tài khoản thành công.',
            user: {
                ...(await result).toObject()
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Tạo người dùng thất bại! vui lòng kiểm tra lại!" })
    }
}