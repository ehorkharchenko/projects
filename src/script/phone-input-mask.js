document.addEventListener( "DOMContentLoaded", function () {

  const phoneInputs = document.querySelectorAll("input[data-tel-input]")

  const getInputNumbersValue = function ( input ) {

    return input.value.trim().replace(/\D/g, "")
  }

  const onPhoneInput = function ( e ) {

    let input = e.target,
          inputNumbersValue = getInputNumbersValue( input ),
          formattedInputValue = " ",
          selectionStart = input.selectionStart

    if ( input.value.length !== selectionStart ) {

      if ( e.data && /\D/g.test(e.data) )
        input.value = inputNumbersValue
      else
        return;
    }

    if ( "3".indexOf( inputNumbersValue[0] ) > -1 ) {
      formattedInputValue += "+38" + inputNumbersValue.substring(0, 0)

      if ( !getInputNumbersValue )
        return input.value = ""

      if ( inputNumbersValue.length > 2 ) {
        formattedInputValue += " (" + inputNumbersValue.substring(2, 5)

        if ( inputNumbersValue.length > 5 ) {

          formattedInputValue += ") " + inputNumbersValue.substring(5, 8)
        }

        if ( inputNumbersValue.length > 8 ) {
          formattedInputValue += " - " + inputNumbersValue.substring(8, 10)
        }

        if ( inputNumbersValue.length > 10 ) {
          formattedInputValue += " - " + inputNumbersValue.substring(10, 12)
        }

        // if (inputNumbersValue.length === 12)
        //   app.order__data.phone__number = formattedInputValue
      }
    }

    if ( "0".indexOf( inputNumbersValue[0] ) > -1 && inputNumbersValue.length <= 2) {
      formattedInputValue += "+38 (" + inputNumbersValue.substring(0, 1)

      if ( !getInputNumbersValue )
        return input.value = ""

      if ( inputNumbersValue.length > 2 ) {

        formattedInputValue += "(" + inputNumbersValue.substring(2, 5)

        if ( inputNumbersValue.length > 5 ) {

          formattedInputValue += ") " + inputNumbersValue.substring(5, 8)
        }

        if ( inputNumbersValue.length > 8 ) {
          formattedInputValue += " - " + inputNumbersValue.substring(8, 10)
        }

        if ( inputNumbersValue.length > 10 ) {
          formattedInputValue += " - " + inputNumbersValue.substring(10, 12)
        }

        // if (inputNumbersValue.length === 12)
        //   app.order__data.phone__number = formattedInputValue
      }
      
    }

    input.value = formattedInputValue
  }

  for ( let i = 0; i < phoneInputs.length; i++ ) {

    let input = phoneInputs[i]

    input.addEventListener( "input", onPhoneInput )
  }

})
