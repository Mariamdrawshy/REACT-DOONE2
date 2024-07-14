import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, ActivityIndicator, StyleSheet } from 'react-native';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  overview: string;
  vote_count: number;
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/list/5?api_key=d4bc3c640586e7f90dc68d8b300247ff&language=en-US'
        );
        const data = await response.json();
        setMovies(data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);



  const handleMoviePress = (movie: Movie): void => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const handleCloseModal = (): void => {
    setModalVisible(false);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)} style={styles.movieItem} activeOpacity={0.7}>
      <Text style={styles.movieTitle}>{item.title}</Text>
      <Text>{item.release_date.substring(0, 4)}</Text>
      <Text>Rating: {item.vote_average}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator testID="loading-indicator" size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {selectedMovie && (
            <View style={styles.modalContent}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` }}
                style={styles.modalImage}
              />
              <Text style={styles.modalText}>{selectedMovie.overview}</Text>
              <Text style={styles.modalText}>Score: {selectedMovie.vote_average}</Text>
              <Text style={styles.modalText}>Votes: {selectedMovie.vote_count}</Text>
              <TouchableOpacity testID="close-button" onPress={handleCloseModal} style={styles.closeButton} activeOpacity={.7}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 20,
  },
  movieItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#5F88B9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 225,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;