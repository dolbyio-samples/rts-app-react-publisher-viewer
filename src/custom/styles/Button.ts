import { defineStyleConfig } from '@chakra-ui/react'


const Button = defineStyleConfig({
    baseStyle: {

    },
    variants: {
        solid: {
            color: 'white',
            _hover: {
                bg: '#8829cc',
                boxShadow: '0 8px 14px rgba(106, 106, 109, 0.28)'
            },
            backgroundColor: 'dolbyPurple.400'
        },
        outline: {
            borderColor: 'dolbyPurple.400',
        }
    },
});

export default Button;