/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Чтобы не было 2 рендеров в dev режиме
    transpilePackages: ["antd"],
};

module.exports = nextConfig;
