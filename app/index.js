import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';

// Available pet and enemy emojis
const pets = ['🐻‍❄️', '🧸'];
const enemies = ['👾', '🧟', '🤖', '👹', '🐉', '🦂', '🐍', '🦀', '🐱', '🐰', '🐯', '🦊', '🐷', '🐸'];

// Define shop items with prices
const items = [
    { name: '🍖 HP Potion+1', type: 'hp', value: 20, price: 3 },
    { name: '🍕 Attack+1', type: 'attack', value: 5, price: 4 },
    { name: '🥗 HP Potion+2', type: 'hp', value: 50, price: 7 },
    { name: '🍔 Attack+2', type: 'attack', value: 10, price: 8 },
    { name: '🍤 HP Potion+3', type: 'hp', value: 100, price: 12 },
    { name: '🍣 Attack+3', type: 'attack', value: 20, price: 15 }
];


export default function App() {
    const getRandomPet = () => pets[Math.floor(Math.random() * pets.length)];
    const getRandomEnemy = () => enemies[Math.floor(Math.random() * enemies.length)];

    const getRandomItems = (level) => {
        const shuffledItems = items.sort(() => 0.5 - Math.random());
        return level < 5 ? shuffledItems.slice(0, 3) : shuffledItems.slice(0, 1);
    };


    // Game states
    const [pet, setPet] = useState(getRandomPet());
    const [level, setLevel] = useState(1);
    const [hp, setHp] = useState(100);
    const [attack, setAttack] = useState(10);
    const [coins, setCoins] = useState(0);

    // Enemy attributes
    const [enemyEmoji, setEnemyEmoji] = useState(getRandomEnemy());
    const [enemyHp, setEnemyHp] = useState(50);
    const [enemyAttack, setEnemyAttack] = useState(8);

    const [isBattleActive, setIsBattleActive] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isShopActive, setIsShopActive] = useState(false);
    const [shopItems, setShopItems] = useState([]);

    // Animation references
    const petAnimation = useRef(new Animated.Value(1)).current;
    const enemyAnimation = useRef(new Animated.Value(1)).current;

    // Reset the game when the player loses
    const resetGame = () => {
        setIsBattleActive(false); // Stop the battle
        Alert.alert('Game Over', 'You lost! Restarting the game...', [
            { text: 'OK', onPress: () => initializeGame() },
        ]);
    };

    // Initialize or reset game state
    const initializeGame = () => {
        setPet(getRandomPet());
        setLevel(1);
        setHp(100);
        setAttack(10);
        setCoins(0);

        setEnemyEmoji(getRandomEnemy());
        setEnemyHp(50);
        setEnemyAttack(8);

        setIsBattleActive(false);
        setIsPlayerTurn(true);
        setIsShopActive(false);
    };

    // Function for player's attack
    const playerAttack = () => {
        if (enemyHp > 0) {
            setEnemyHp((prevHp) => Math.max(0, prevHp - attack));
        }
        setIsPlayerTurn(false);
    };

    // Function for the enemy's attack
    const enemyAttackTurn = () => {
        if (hp > 0) {
            setHp((prevHp) => Math.max(0, prevHp - enemyAttack));
        }
        setIsPlayerTurn(true);
    };

    // Handle the battle turns automatically
    useEffect(() => {
        if (isBattleActive) {
            const timer = setTimeout(() => {
                // Check if the battle is already over
                if (hp <= 0) {
                    resetGame();
                    return;
                } else if (enemyHp <= 0) {
                    winBattle();
                    return;
                }

                // Handle turns
                if (isPlayerTurn) {
                    playerAttack();
                } else {
                    enemyAttackTurn();
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, isBattleActive, hp, enemyHp]);

    // Handle winning a battle
    const winBattle = () => {
        const reward = Math.floor(Math.random() * 8) + 3; // Random reward between 3 and 10 coins
        Alert.alert('Victory!', `You defeated the enemy and earned ${reward} coins!`);
        setCoins((prevCoins) => prevCoins + reward);
        setLevel((prevLevel) => prevLevel + 1);
        setIsBattleActive(false);

        // Move to shop scene
        setShopItems(getRandomItems(level));
        setIsShopActive(true);
    };

    // Animate turn indicator
    const animateTurn = (animation) => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 1.2, duration: 300, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    };

    useEffect(() => {
        if (isPlayerTurn) {
            animateTurn(petAnimation);
        } else {
            animateTurn(enemyAnimation);
        }
    }, [isPlayerTurn]);

    // Handle purchasing an item from the shop
    const purchaseItem = (itemIndex) => {
        const item = shopItems[itemIndex];

        // ตรวจสอบว่าเหรียญเพียงพอสำหรับการซื้อ
        if (coins < item.price) {
            Alert.alert('Not enough coins!', `You need ${item.price} coins.`);
            return;
        }

        // หักเหรียญเมื่อซื้อ item
        setCoins((prevCoins) => prevCoins - item.price);

        // เพิ่มค่า HP หรือ Attack ขึ้นอยู่กับประเภทของ item
        if (item.type === 'hp') {
            setHp((prevHp) => prevHp + item.value);
        } else if (item.type === 'attack') {
            setAttack((prevAttack) => prevAttack + item.value);
        }

        // อัปเดทรายการ shopItems โดยลบ item ที่ถูกซื้อออก
        setShopItems((prevItems) => prevItems.filter((_, index) => index !== itemIndex));

        setIsPlayerTurn(false);
    };


    const initializeBattle = () => {
        setEnemyEmoji(getRandomEnemy());
        setEnemyHp(10 + level * 10);
        setEnemyAttack(3 + level);
        setIsBattleActive(true);
    };

    const startBattle = () => {
        setIsBattleActive(true);
        setIsPlayerTurn(true);
    };

    return (
        <View style={styles.container}>

            <View style={styles.card}>

            <Animated.Text style={[styles.pet, { transform: [{ scale: petAnimation }] }]}>
                {pet}
            </Animated.Text>
                <Text style={styles.cardContent}>📖 Level: {level}</Text>
                <Text style={styles.cardContent}>❤️‍🩹 HP: {hp}</Text>
                <Text style={styles.cardContent}>🗡 Attack: {attack}</Text>
                <Text style={styles.cardContent}>💰 Coins: {coins}</Text>
            </View>


            {isBattleActive && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Battle</Text>
                    <Animated.Text style={[styles.enemyEmoji, { transform: [{ scale: enemyAnimation }] }]}>
                        {enemyEmoji}
                    </Animated.Text>
                    <Text style={styles.cardContent}>❤️‍🩹 Enemy HP: {enemyHp}</Text>
                    <Text style={styles.cardContent}>🗡 Enemy Attack: {enemyAttack}</Text>
                    <Text style={styles.cardContent}>{isPlayerTurn ? "Your Turn" : "Enemy's Turn"}</Text>
                </View>
            )}

{isShopActive && (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Supper Shop</Text>
        {shopItems.map((item, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => purchaseItem(index)}
                style={[styles.shopItem, { backgroundColor: '#A9CFA1' }]}
                disabled={coins < item.price}
            >
                <Text style={styles.shopItemName}>{item.name}</Text>
                <Text style={styles.shopItemDetails}>
                    (+{item.value} {item.type === 'hp' ? 'HP' : 'Attack'}) - {item.price} Coins
                </Text>
            </TouchableOpacity>
        ))}

        <TouchableOpacity
            onPress={() => { setIsShopActive(false); initializeBattle(); }}
            style={styles.buttonPrimary}
        >
            <Text style={styles.buttonText}>Next ➡️</Text>
        </TouchableOpacity>
    </View>
)}



            {!isBattleActive && !isShopActive && (
                <TouchableOpacity onPress={startBattle} style={styles.buttonPrimary}>
                    <Text style={styles.buttonText}>Battle ⚔️</Text>
                </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6EAE0', // Light greenish background for an eco-friendly look
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2F4F4F', // Dark Slate Gray for natural aesthetics
    },
    pet: {
        fontSize: 60,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#F0F5F3',
        padding: 15,
        margin: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        width: '90%',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2F4F4F',
    },
    cardContent: {
        fontSize: 16,
        marginBottom: 8,
        color: '#556B2F',
    },
    buttonPrimary: {
        backgroundColor: '#6B8E23', // Olive Drab color for buttons
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: '80%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Battle Section
    enemyEmoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    battleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4B5320', // Olive green for battle titles
    },
    // Shop Section
    shopItem: {
        backgroundColor: '#A9CFA1', // Soft green for shop items
        padding: 12,
        marginVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    shopItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2F4F4F',
    },
    shopItemDetails: {
        fontSize: 14,
        color: '#556B2F',
        marginTop: 4,
    },
    shopTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#556B2F',
    },
    skipButton: {
        backgroundColor: '#8F6A5F', // Earthy brown for a natural look
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
    },
    stats: {
        marginBottom: 20,
        alignItems: 'center',
    },
    statsText: {
        fontSize: 16,
        color: '#4B5320',
        marginVertical: 4,
    },
    // Turn Indicator Animation
    animatedTurn: {
        fontSize: 50,
        marginBottom: 10,
    },
});




