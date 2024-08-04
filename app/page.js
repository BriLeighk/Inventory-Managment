'use client'
import { useRouter } from 'next/router'
import Image from "next/image"
import { useState,useEffect } from "react"
import { firestore } from "@/firebase"
import { Box, Button, Modal,Stack,TextField, Typography } from "@mui/material"
import { collection, deleteDoc,doc,setDoc,getDocs, query,getDoc} from "firebase/firestore"


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open , setOpen] = useState(false)
  const [itemName , setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc)=> {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList);
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'),item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
        const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity+1})
      }
      else{
        await setDoc(docRef, {quantity: 1})
      }


    await updateInventory()
  }



  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'),item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity===1) {
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity-1})
      }
    }

    await updateInventory()
  }

  useEffect(()=> {
    updateInventory()
  },[])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return ( 
  <Box width="100%" height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} 
  sx={{
    fontFamily: 'Cormorant',
    background: 'radial-gradient(circle at 50% 20%, #302a18, #1c1c1c 20%)',
    margin: '0',
    paddingBottom: '50px',
    overflowY: 'scroll',
      scrollbarWidth: 'none', // For Firefox
      '&::-webkit-scrollbar': {
        display: 'none', // For Chrome, Safari, and Opera
      }
  }}
  >

  {/* Header */}
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" alignSelf="center" margin="50px" gap={2}>
      <Box width="100%" height="100px" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color='#f6f6f6' fontFamily="Baskervville SC, serif">
            Inventory Manager
          </Typography>
      </Box>

      <Box color='#f6f6f6' sx={{ fontFamily: 'Baskervville SC, serif' }}><p>Some Description goes here</p></Box>
  </Box>

  {/* Add Item Modal - onClick of Add New Item Button */}
  <Modal open={open} onClose={handleClose}>
    <Box 
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 400,
      border: "1px solid #000",
      p: 4,
      display: "flex",
      flexDirection: "column",
      gap: 3,
      transform: "translate(-50%,-50%)",
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
      background: 'radial-gradient(circle, #302a18 0%, #1c1c1c 200%)',
      color: '#f6f6f6',
      border: '1px solid #f6f6f6',
      borderRadius: '10px',
    }}>
      <Typography variant="h6" fontFamily="Cormorant">Add Item</Typography>
      <Stack width="100%" direction="row" spacing={2}>
        
        <TextField
        variant="outlined"
        fullWidth
        value={itemName}
        sx={{
          border: '1px solid #f6f6f6',
          color: '#f6f6f6',
          boxShadow: 'inset 0 0 10px #1c1c1c',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#f6f6f6', // Initial border color
            },
            '&.Mui-focused fieldset': {
              border: 'none', // Remove border when focused
            },
            '&.Mui-focused': {
              color: '#f6f6f6', // Text color when focused
            },
          },
          '& .MuiInputBase-input': {
            color: '#f6f6f6', // Ensure text color is #f6f6f6
          },
        }}
        onChange={(e)=>{
          setItemName(e.target.value)
        }}
        ></TextField>

        
        <Button
        variant="outlined" 
        sx={{
          border: '1px solid #f6f6f6',
          color: '#f6f6f6',
          boxShadow: 'inset 0 0 10px #1c1c1c',

        }}
        onMouseOver={(e)=>{
          e.target.style.border = '1px solid #1c1c1c'
          e.target.style.backgroundColor = 'transparent'
        }}
        onMouseOut={(e)=>{
          e.target.style.border = '1px solid #f6f6f6'
        }}
        onClick={()=>{
          addItem(itemName)
          setItemName('')
          handleClose()
        }} 
        >
          Add
        </Button>
      </Stack>
    </Box>
  </Modal>
    
      

      {/* Search Bar */}
    <Box width="80%" margin="10px 10px 0px 10px">
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
        sx={{
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
          '& .MuiInputBase-input::placeholder': {
            color: '#f6f6f6', // Placeholder text color
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#f6f6f6', // Initial border color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f6f6f6', // Border color when focused
            },
          },
          '& .MuiInputBase-input': {
            color: '#f6f6f6', // Typing text color
          },
        }}
      />
    </Box>

    {/* Inventory Items Box */}
    <Box width="80%" margin="0px 10px 10px 10px" padding={2} border='1px solid #f6f6f6'
    sx={{
      borderRadius: '10px',
      background: '#1c1c1c',
    }}
    >
      

    {/* Explanation Bar */}
    <Box width="100%" height="40px" display="flex" justifyContent="space-between" padding={1}  
    color="#f6f6f6"
    sx={{
      background: 'radial-gradient(circle, #302a18 0%, #1c1c1c 200%)',
      width: '95%',
      margin: '2% auto',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
      
    }}
    >
      <Typography variant="h7" textAlign="center" width="33%">
        Pantry Item
      </Typography>
      <Typography variant="h7" textAlign="center" width="33%">
        Quantity
      </Typography>
      <Typography variant="h7" textAlign="center" width="33%">
        Modify
      </Typography>

    </Box>

    <Box width="110px" margin="20px" alignSelf="flex-start"
    sx={{
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
    }}
    >
      
      {/* Add New Item Button */}
      <Button variant="contained" onClick={handleOpen} fullWidth
      sx={{
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
        color: '#f6f6f6',
        background: 'radial-gradient(circle, #302a18 0%, #1c1c1c 200%)',
        fontSize: '10px',
        fontFamily: 'Cormorant',
        transition: 'background 0.3s, color 0.3s',

      }}
      onMouseOver={(e)=>{
        e.target.style.background = '#f6f6f6'
        e.target.style.color = '#1c1c1c'
        e.target.style.transition = 'background 0.3s, color 0.3s'
        
      }}
      onMouseOut={(e)=>{
        e.target.style.background = 'radial-gradient(circle, #302a18 0%, #1c1c1c 200%)'
        e.target.style.color = '#f6f6f6'
        e.target.style.transition = 'background 0.3s, color 0.3s'
      }}
      >
        Add New Item
      </Button>
    </Box>


    {/* Inventory Items */}
    <Stack width="100%" height="300px" spacing={2} padding={1} overflow="auto"
    sx={{
      overflowY: 'scroll',
      scrollbarWidth: 'none', // For Firefox
      '&::-webkit-scrollbar': {
        display: 'none', // For Chrome, Safari, and Opera
      }
    }}
    >
      {
        filteredInventory.map(({name, quantity})=>(
          
          <Box key={name} width="100%"
          minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" 
          padding={5} boxShadow={3}
          sx={{
            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
            color: '#f6f6f6',
            background: 'radial-gradient(circle, #302a18 0%, #1c1c1c 200%)', // More transparent background
            borderRadius: '10px',
          }}
        >
            <Typography variant="h6" textAlign="center" width="33%" fontFamily="Cormorant">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h6" textAlign="center" width="33%">
              {quantity}
            </Typography>

            <Stack direction="row" spacing={2} width="33%" justifyContent="center">
            
            {/* Add Button */}
            <Button variant="contained" size="small"
            sx={{
              boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
              color: '#f6f6f6',
              background: '#1c1c1c',
              fontFamily: 'Cormorant',
              fontSize: '10px',
              transition: 'background 0.3s, color 0.3s',
            }}
            onMouseOver={(e)=>{
              e.target.style.background = '#f6f6f6'
              e.target.style.color = '#1c1c1c'
              e.target.style.transition = 'background 0.3s, color 0.3s'
            }}
            onMouseOut={(e)=>{
              e.target.style.background = '#1c1c1c'
              e.target.style.color = '#f6f6f6'
              e.target.style.transition = 'background 0.3s, color 0.3s'
            }}
            onClick={()=>{
              addItem(name)
            }}>Add</Button>


            {/* Remove Button */} 
            <Button variant="contained" size="small" 
            sx={{
              boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
              color: '#f6f6f6',
              background: '#1c1c1c',
              fontFamily: 'Cormorant',
              fontSize: '10px',
              transition: 'background 0.3s, color 0.3s',
            }}
            onMouseOver={(e)=>{
              e.target.style.background = '#f6f6f6'
              e.target.style.color = '#1c1c1c'
              e.target.style.transition = 'background 0.3s, color 0.3s'
            }}
            onMouseOut={(e)=>{
              e.target.style.background = '#1c1c1c'
              e.target.style.color = '#f6f6f6'
              e.target.style.transition = 'background 0.3s, color 0.3s'
            }}
            onClick={()=>{
              removeItem(name)
            }}>Remove</Button>
            </Stack>
          </Box>
        ))}
    </Stack>
    </Box>
    </Box>
  )
}