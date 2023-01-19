const getPermission = (permissions, permissionName) => {
    for (let { name } of permissions) {
        if(name === permissionName) return true;
    }
    return false;
};

export default getPermission;