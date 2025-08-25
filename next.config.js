/**
 * next.config.js
 * - ignore problematic system files from the watcher to avoid Watchpack EINVAL errors
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // configure webpack watcher options to ignore problematic system files
  webpack: (config) => {
    config.watchOptions = config.watchOptions || {}
    config.watchOptions.ignored = config.watchOptions.ignored || [
      /node_modules/,
      /.next/,
      /C:\\DumpStack.log.tmp/,
      /C:\\pagefile.sys/,
      /C:\\swapfile.sys/
    ]
    return config
  }
}

module.exports = nextConfig
