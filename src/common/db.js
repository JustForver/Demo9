let DB = {
    // 使用key来保存数据。这些数据一般是全局独有的，常常需要调用的。
    // 除非你手动移除，这些数据会被永久保存，而且默认不会过期。
    save: (key, rawData, expires) => {
        storage.save({
            key,
            rawData,
            expires
        });
    },

    // 使用key和id来保存数据，一般是保存同类别（key）的大量数据。
    // 这些"key-id"数据有一个保存上限，即在初始化storage时传入的size参数。
    // 在默认上限参数下，第1001个数据会覆盖第1个数据。
    // 覆盖之后，再读取第1个数据，会返回catch或是相应的同步方法。
    saveById: (key, id, rawData, expires) => {
        storage.save({
            key,
            id,
            rawData,
            expires
        });
    },

    load: (key, successCallback, failCallback) => {
        storage.load({
            key,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的同步方法
            autoSync: true,
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用同步方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true
        }).then(ret => {
            //如果找到数据，则在then方法中返回
            successCallback(ret);
        }).catch(err => {
            //如果没有找到数据且没有同步方法，
            //或者有其他异常，则在catch中返回
            failCallback(err);
        })
    },

    loadById: (key, id, successCallback, failCallback) => {
        storage.load({
            key,
            id,
            autoSync: true,
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用同步方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true
        }).then(ret => {
            //如果找到数据，则在then方法中返回
            successCallback(ret);
        }).catch(err => {
            //如果没有找到数据且没有同步方法，
            //或者有其他异常，则在catch中返回
            failCallback(err);
        })
    }
};

export let key = {
    ACCOUNT: "ACCOUNT",//账号
};

export default DB;