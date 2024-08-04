'use client'
import Image from "next/image"; 
import {useState, useEffect} from 'react' 
import {firestore} from '@/firebase' 
import {Box, Button, Modal, Stack, TextField, Typography} from '@mui/material'
import {collection, deleteDoc, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";

export default function Home() {  
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')  
  const [editItemName, setEditItemName] = useState('') 
  const [editItemQuantity, setEditItemQuantity] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory")) 
    const docs = await getDocs(snapshot) 
    const inventoryList = [] 
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id, 
        ...doc.data(),
      })
    }) 
    setInventory(inventoryList)
  } 
  
  const handleOpen = async (name) => {
    const docRef = doc(collection(firestore, 'inventory'), name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setEditItemName(name);
      setEditItemQuantity(docSnap.data().quantity); // Adjust 'quantity' to your document field
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItemName('');
    setEditItemQuantity('');
  };

  const addItem = async (item) => { 
    const docRef = doc(collection(firestore,'inventory'),item) 
    const docSnap = await getDoc(docRef) 

    if(docSnap.exists()){
      const {quantity} = docSnap.data() 
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }   

  const updateItem = async () => { 
    const docRef = doc(collection(firestore,'inventory'), editItemName) 
    await setDoc(docRef, {quantity: parseInt(editItemQuantity, 10)});
    await updateInventory()
    handleClose();
  } 

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore,'inventory'),item) 
    const docSnap = await getDoc(docRef) 

    if(docSnap.exists()){
      const {quantity} = docSnap.data() 
      if(quantity === 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    } 
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"  
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"  
      border="2px solid white"
      gap={2}
    >  
      <Modal open={open} onClose={handleClose}> 
        <Box 
          position="absolute" 
          top="50%" left="50%" 
          sx={{
           transform: "translate(-50%,-50%)" 
          }}
          width={400} 
          bgcolor="white" 
          border="2px solid #000"
          boxShadow={24}  
          p={4}  
          display="flex" 
          flexDirection="column" 
          gap={3}
        >
          <Typography variant="h6" color="black">Edit Quantity</Typography>
          <Stack width="100%" direction="row" spacing={2}> 
            <TextField  
              id="modal-input" 
              value={editItemQuantity}
              variant="outlined" 
              fullWidth 
              onChange={(e)=>{
                setEditItemQuantity(e.target.value)
              }}
            />  
            <Button 
              variant="outlined" 
              onClick={updateItem}
            >Update</Button> 
          </Stack> 
        </Box>
      </Modal>

      <Button 
        variant="contained" 
        onClick={() => {
          setOpen(true);
        }}
      >Add New Item</Button> 
      <Box>
        <Box 
          width="800px" 
          height="100px" 
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography 
            variant="h2" color="white"
          >
            Inventory Items
          </Typography>
        </Box>
      </Box> 
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({name, quantity}) => (
          <Box 
            key={name} 
            width="100%" 
            minHeight="150px" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            border="2px solid white"
            padding={5} 
          >
            <Typography 
              variant='h3' 
              color='white' 
              textAlign='center'
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography> 
            <Typography 
              variant='h3' 
              color="white" 
              textAlign='center'
            >
              {quantity}
            </Typography>   
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                onClick={() => {
                  addItem(name)
                }}>
                Add
              </Button>  
              <Button 
                variant="contained" 
                onClick={() => { 
                  handleOpen(name)
                }}>
                Edit
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  removeItem(name)
                }}>
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box> 
  )
}
