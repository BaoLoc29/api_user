import express from 'express';
import { login, createUser } from '../controllers/user.js';
import authentication from "../middlewares/authentication.js"

const router = express.Router();
/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "loctran@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Thông tin đăng nhập không hợp lệ
 *       401:
 *         description: Mật khẩu không chính xác
 *       402:
 *         description: Email không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post('/login', login);

/**
 * @openapi
 * /user/create-user:
 *   post:
 *     summary: Tạo người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Trần Bảo Lộc"
 *               age:
 *                 type: integer
 *                 example: 21
 *               gender:
 *                 type: boolean
 *                 example: true
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "loctran@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Tạo người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Thông tin không hợp lệ
 *       401:
 *         description: Email đã được sử dụng
 *       500:
 *         description: Lỗi server
 */
router.post('/create-user', authentication, createUser);

export default router;
