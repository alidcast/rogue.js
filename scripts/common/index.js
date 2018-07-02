exports.bundleApp = async (clientBundler, serverBundler) => {
    try {
      // we run the bundles one at a time to avoid compilation problems with Parcel
      await clientBundler.bundle()
      await serverBundler.bundle()
      console.log('Compiled succesfully!')
    } catch (err) {
      if (err && err.message) console.log(err.message)
      process.exit(1)
    }
  }