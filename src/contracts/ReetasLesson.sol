// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract ReetasLesson {

    uint256 public coursePrice;
    address owner;

    event UserRegistered(address indexed userAddress, string name, uint256 timestamp);
    event PurchaseMade(uint256 indexed purchaseId, address indexed userAddress, string item, uint256 price);
    event LessonCompleted(address indexed userAddress, uint256 lessonId, uint256 timestamp);

    //structure
    struct User {
        string name;
        uint256 timestamp;
        address userAddress;
        uint256 totalPurchases;
        uint256 totalProgress;
        uint256[] completedLessons;  // Kullanıcının tamamladığı derslerin listesi
        uint256[] purchasedLessons;
    }

    struct Purchase {
        uint256 purchaseId;
        address userAddress;
        string item;
        uint256 price;
        uint256 timestamp;
    }

    // Mapping for users
    mapping(address => User) public users;

    // Array of purchases
    Purchase[] public purchases;

    constructor() {
        owner = payable(msg.sender);
        coursePrice = 0.1 * 10 ** 18;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform");
        _;
    }

    modifier checkPrice() {
        require(msg.value == coursePrice, "Not enough Price");
        _;
    }

    // Functions to change the dynamics
    function changePrice(uint256 _newPrice) external onlyOwner {
        coursePrice = _newPrice * 10 ** 18;
    }

    function withdrawContractBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Register a new user
    function registerUser(string memory _name) public {
        require(users[msg.sender].userAddress == address(0), "User already registered");

        // Initialize a new user
        User storage newUser = users[msg.sender];
        newUser.name = _name;
        newUser.timestamp = block.timestamp;
        newUser.userAddress = msg.sender;
        newUser.totalPurchases = 0;
        newUser.totalProgress = 0;
        newUser.completedLessons.push(0);
        newUser.purchasedLessons.push(0);

        emit UserRegistered(msg.sender, _name, block.timestamp);
    }

    // Make a purchase
    function makePurchase(string memory _item, uint256 _lessonid) public payable checkPrice {
        require(users[msg.sender].userAddress != address(0), "User not registered");

        uint256 purchaseId = purchases.length;
        purchases.push(Purchase({
            purchaseId: purchaseId,
            userAddress: msg.sender,
            item: _item,
            price: coursePrice,
            timestamp: block.timestamp
        }));

        users[msg.sender].totalPurchases += coursePrice;
        users[msg.sender].purchasedLessons.push(_lessonid);

        emit PurchaseMade(purchaseId, msg.sender, _item, coursePrice);
    }

    // Update user's progress
    function updateProgress(uint256 _progress) public {
        require(users[msg.sender].userAddress != address(0), "User not registered");

        users[msg.sender].totalProgress += _progress;
    }

    // Complete a lesson
    function completeLesson(uint256 lessonId) public {
        require(users[msg.sender].userAddress != address(0), "User not registered");

        // Check if lesson is already completed
        for (uint256 i = 0; i < users[msg.sender].completedLessons.length; i++) {
            require(users[msg.sender].completedLessons[i] != lessonId, "Lesson already completed");
        }

        // Add the completed lesson to the array
        users[msg.sender].completedLessons.push(lessonId);

        emit LessonCompleted(msg.sender, lessonId, block.timestamp);
    }

    // Check if a user has completed a specific lesson
    function hasCompletedLesson(address _userAddress, uint256 lessonId) public view returns (bool) {
        require(users[_userAddress].userAddress != address(0), "User not registered");

        for (uint256 i = 0; i < users[_userAddress].completedLessons.length; i++) {
            if (users[_userAddress].completedLessons[i] == lessonId) {
                return true;
            }
        }

        return false;
    }

    // Get user info (name, timestamp, purchases, progress, completed lessons)
    function getUserInfo(address _userAddress) public view returns (string memory, uint256, uint256, uint256, uint256[] memory,uint256[] memory) {
        User storage user = users[_userAddress];
        return (user.name, user.timestamp, user.totalPurchases, user.totalProgress, user.purchasedLessons ,user.completedLessons);
    }

    // Get purchase details
    function getPurchase(uint256 _purchaseId) public view returns (address, string memory, uint256, uint256) {
        Purchase memory purchase = purchases[_purchaseId];
        return (purchase.userAddress, purchase.item, purchase.price, purchase.timestamp);
    }
}
