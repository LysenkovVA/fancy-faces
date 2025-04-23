/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, // Чтобы не было 2 рендеров в dev режиме
    transpilePackages: ["antd"],
};

module.exports = nextConfig;
