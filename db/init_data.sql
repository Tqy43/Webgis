-- 管理员账号初始化数据
-- 密码为Super1234，下面是使用bcrypt算法加密后的哈希值
-- 实际应用中，这个哈希值应该在Python代码中生成，这里仅做演示
INSERT INTO users (username, password_hash, is_admin)
VALUES ('Super', '$2a$12$tVN1BJgwHxjCrJ7T0xwY1eX0U2CufQSjDnNzJ5cKR8XMo.tE.J7Hu', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 可以在此添加其他初始化数据，如默认景点、路线等 