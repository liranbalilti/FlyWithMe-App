import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const FormCity = ({onDest}) => {

  return (
        <GooglePlacesAutocomplete
            placeholder='Enter Country, City (your destination)'
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            keyboardAppearance={'light'}
            listViewDisplayed='auto'
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {
                onDest(data.description);
            }}
            getDefaultValue={ () => ''}
            query={{
                key: 'API Key',
                language: 'en',
                types: '(cities)'
            }}
            styles={{
                textInputContainer: {
                    width: '100%'
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                }

            }}
            
    />
  );
};

export default FormCity;
