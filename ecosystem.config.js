module.exports = {
  apps : [{
    name   : "rest-node-firmware",
    script : "npm run build && npm run start:pi",
    watch: true,
    ignore_watch: [
        "node_modules",
        "dist",
        "static"
    ]
  }]
}
