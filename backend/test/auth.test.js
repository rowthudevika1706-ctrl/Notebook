const jwt = require("jsonwebtoken");
const {
  generateToken,
  generateOTP,
} = require("../controllers/userControllers");

describe("Auth Utility Functions", () => {
  beforeAll(() => {
    process.env.JWT_SECRET_KEY = "testsecret";
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const token = generateToken("123");

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should contain correct user id in payload", () => {
      const token = generateToken("123");

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      expect(decoded.id).toBe("123");
    });

    it("should expire in 5 hours", () => {
      const token = generateToken("123");

      const decoded = jwt.decode(token);

      const expiryTime = decoded.exp - decoded.iat;
      expect(expiryTime).toBe(5 * 60 * 60);
    });
  });

  describe("generateOTP", () => {
    it("should generate a 6-digit OTP", () => {
      const otp = generateOTP();

      expect(otp).toBeGreaterThanOrEqual(100000);
      expect(otp).toBeLessThanOrEqual(999999);
    });

    it("should always return a number", () => {
      const otp = generateOTP();

      expect(typeof otp).toBe("number");
    });
  });
});
