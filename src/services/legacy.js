upload(req, res, async (err) => {
    try {
        if (err) throw new Error(err);
        const { name, email, token, ...postData } = req.body;
        const _id = await authService.authenticate(name, email, token);
        if (_id === null) return res.status(401).json({ msg: "unauthorized" });

        const { status, data } = await postService.upload(_id, postData, req.files);
        return res.status(status).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "internal server error"
        });
    }
});