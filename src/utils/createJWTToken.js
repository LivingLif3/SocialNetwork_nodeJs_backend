import jwt from "jsonwebtoken";
import lodash from "lodash";

export default (user) => {
    let token = jwt.sign({
        data: lodash.reduce(
            user,
            (result, value, key) => {
                if (key !== 'password') {
                    result[key] = value;
                }
                return result;
            }, {}
        )
    },
        process.env.JWT_SECRET_KEY || "",
        {
            expiresIn: 3600 * 24 * 7
        }
    )
    return token;
}