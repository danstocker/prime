var mocks = mocks || {};

// mock node object
mocks.node = function (str) {
    return {
        load: str
    };
};
